import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/product';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query: any = {};

    // Search
    const search = searchParams.get('search');

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');

      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Shop category
    const shopCategory = searchParams.get('shop_category');

    if (
      shopCategory &&
      shopCategory.trim() !== '' &&
      shopCategory !== 'Select Shop'
    ) {
      query.shop_category = shopCategory;
    }

    // Categories
    const categoryParam = searchParams.get('categories');

    if (categoryParam && categoryParam.trim() !== '') {
      const categories = categoryParam.split(',');

      query.categories = {
        $in: categories
      };
    }

    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (
      (minPrice && minPrice.trim() !== '') ||
      (maxPrice && maxPrice.trim() !== '')
    ) {
      query.price = {};

      if (minPrice && minPrice.trim() !== '') {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice && maxPrice.trim() !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Sorting
    let sort: any = { createdAt: -1 };

    const sortParam = searchParams.get('sort');

    if (sortParam && sortParam.trim() !== '') {
      const [field, order] = sortParam.split(':');

      if (field) {
        sort = {
          [field]: order === 'desc' ? -1 : 1
        };
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      total,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
