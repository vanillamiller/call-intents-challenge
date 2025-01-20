// src/lambda/categories/get/index.ts
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { PrismaClient } from '@amiller/prisma'

const prisma = new PrismaClient()

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const categories = await prisma.intentCategory.findMany({
      include: {
        _count: {
          select: { 
            intents: true 
          }
        }
      }
    })

    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      intentCount: category._count.intents
    }))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoriesWithCount)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}