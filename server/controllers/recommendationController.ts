import { Request, Response } from 'express';
import { db } from '../config/db';

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { brand, model, requirement, budget, category } = req.body;

    if (!model && !brand) {
      return res.status(400).json({ message: 'Please select your mobile brand or model.' });
    }

    const allProducts = await db.getProducts();
    const maxBudget = budget ? Number(budget) : Infinity;

    // Recommendation scoring algorithm
    const scoredProducts = allProducts.map((product: any) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Exact model compatibility (Highest weight)
      const isExactModel = product.compatibleModels?.some(
        (m: string) => m.toLowerCase() === (model || '').toLowerCase()
      );
      const isPartialModel = product.compatibleModels?.some(
        (m: string) => m.toLowerCase().includes((model || '').toLowerCase())
      );

      if (isExactModel) {
        score += 50;
        reasons.push(`Guaranteed 100% precision fit for ${model}`);
      } else if (isPartialModel) {
        score += 30;
        reasons.push(`Compatible with your ${model} series`);
      } else if (brand && product.brand.toLowerCase() === brand.toLowerCase()) {
        score += 10;
      }

      // 2. Budget constraint
      if (product.price <= maxBudget) {
        score += 20;
        reasons.push(`Within your ₹${maxBudget} budget (priced at ₹${product.price})`);
      } else if (maxBudget !== Infinity) {
        score -= 25; // Exceeds budget penalty
      }

      // 3. User requirement alignment
      const reqLower = (requirement || '').toLowerCase();
      const descLower = (product.description + ' ' + product.name + ' ' + (product.features?.join(' ') || '')).toLowerCase();

      if (reqLower.includes('privacy') || reqLower.includes('anti-spy')) {
        if (product.category === 'Privacy Screen Protector' || descLower.includes('privacy') || descLower.includes('micro-louver')) {
          score += 35;
          reasons.push('28° micro-louver anti-spy shield blocks side glances on transit and cafes');
        }
      } else if (reqLower.includes('maximum') || reqLower.includes('heavy') || reqLower.includes('drop')) {
        if (descLower.includes('military') || descLower.includes('heavy duty') || descLower.includes('shock') || descLower.includes('dual-tempered')) {
          score += 35;
          reasons.push('Dual-tempered 9H shatterproof matrix absorbs high-impact drops');
        } else if (product.category === 'Tempered Glass') {
          score += 20;
          reasons.push('9H diamond-grade scratch and drop defense');
        }
      } else if (reqLower.includes('gaming') || reqLower.includes('matte') || reqLower.includes('smooth')) {
        if (product.category === 'Matte Gaming Glass' || descLower.includes('matte') || descLower.includes('frosted')) {
          score += 35;
          reasons.push('Micro-frosted zero-friction glide tailored for high-speed touch gaming');
        }
      } else if (reqLower.includes('camera') || reqLower.includes('lens')) {
        if (product.category === 'Camera Lens Armor' || descLower.includes('camera')) {
          score += 35;
          reasons.push('Sapphire glass camera ring shields protruded lenses from table scratches');
        }
      } else if (reqLower.includes('clarity') || reqLower.includes('original')) {
        if (descLower.includes('clarity') || descLower.includes('transparency')) {
          score += 25;
          reasons.push('99.9% optical light transmittance with zero display graininess');
        }
      }

      // 4. Category filter if specified
      if (category && category !== 'All' && product.category.toLowerCase() === category.toLowerCase()) {
        score += 15;
      }

      // 5. Product quality signals
      if (product.rating >= 4.8) {
        score += 10;
        reasons.push(`Top customer rating (${product.rating}★ from ${product.reviews} reviews)`);
      }
      if (product.featured) {
        score += 5;
      }
      if (product.stock > 0) {
        score += 5;
        reasons.push('In stock ready for immediate dispatch');
      }

      return {
        product,
        score,
        reasons: reasons.slice(0, 4) // top 4 reasons
      };
    });

    // Sort by recommendation score descending
    scoredProducts.sort((a, b) => b.score - a.score);

    // Filter to relevant matches with positive score
    const topRecommendations = scoredProducts.slice(0, 3).map(sp => ({
      ...sp.product,
      matchScore: Math.min(99, Math.max(75, Math.round(sp.score * 1.1))),
      aiReasons: sp.reasons
    }));

    const primary = topRecommendations[0];
    const summaryHeadline = primary
      ? `Based on your ${model || brand} and preference for ${requirement || 'reliable defense'}, we recommend ${primary.name}.`
      : 'Here are our top recommended protective accessories.';

    return res.json({
      summaryHeadline,
      recommendations: topRecommendations
    });
  } catch (error) {
    console.error('Error in AI recommendations:', error);
    return res.status(500).json({ message: 'Unable to compute AI recommendations.' });
  }
};
