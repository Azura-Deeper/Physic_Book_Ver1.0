import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import Chapter from '../../../models/Chapter'

export async function GET() {
  try {
    await dbConnect()
    const chapters = await Chapter.find({ isPublished: true }).sort({ order: 1 })
    return NextResponse.json(chapters)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const chapter = new Chapter(body)
    await chapter.save()
    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 })
  }
}