import { NextRequest, NextResponse } from 'next/server'

const raceTexts = {
  easy: [
    "The cat sat on the mat and looked at the dog. It was a sunny day and birds were singing in the trees.",
    "She walked to the store to buy some bread and milk. The weather was nice for a short walk outside.",
    "He likes to read books about space and stars. Learning new things makes him very happy every day."
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog. Speed and accuracy are the keys to victory in this thrilling typing race.",
    "Racing through words at lightning speed, fingers dance across the keyboard in perfect harmony with thoughts and dreams.",
    "Technology has transformed the way we communicate, work, and live our daily lives in the modern digital world."
  ],
  hard: [
    "In the world of competitive typing, every keystroke matters and every second counts toward achieving greatness and mastery.",
    "Champions are made not by luck but by dedication, practice, and the relentless pursuit of perfection in every racing challenge.",
    "The synchronized complexity of multi-dimensional arrays requires sophisticated algorithms and optimized data structures for efficiency."
  ],
  expert: [
    "Quantum computing represents a paradigm shift in computational capabilities, leveraging quantum mechanical phenomena to process information exponentially.",
    "The intricate interdependencies of distributed systems necessitate robust fault-tolerance mechanisms and comprehensive monitoring infrastructure architectures.",
    "Cryptographic protocols utilize mathematical complexity to ensure data integrity, confidentiality, and authentication in secure communication channels."
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty') || 'medium'
    const count = parseInt(searchParams.get('count') || '1')
    
    const availableTexts = raceTexts[difficulty as keyof typeof raceTexts] || raceTexts.medium
    
    const selectedTexts = []
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableTexts.length)
      selectedTexts.push(availableTexts[randomIndex])
    }
    
    return NextResponse.json({
      texts: selectedTexts,
      difficulty,
      count
    })
  } catch (error) {
    console.error('Error fetching texts:', error)
    return NextResponse.json({ error: 'Failed to fetch texts' }, { status: 500 })
  }
}