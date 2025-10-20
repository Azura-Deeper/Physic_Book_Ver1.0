import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import Chapter from '../../../../models/Chapter'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const chapter = await Chapter.findById(params.id)
    
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    
    return NextResponse.json(chapter)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chapter' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const chapter = await Chapter.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    
    return NextResponse.json(chapter)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const chapter = await Chapter.findByIdAndDelete(params.id)
    
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Chapter deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 })
  }
}