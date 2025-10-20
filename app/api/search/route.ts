import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import Chapter from '../../../models/Chapter'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const results = await Chapter.find({
      $and: [
        { isPublished: true },
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { 'sections.title': { $regex: query, $options: 'i' } },
            { 'sections.content': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('id title content sections')

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}