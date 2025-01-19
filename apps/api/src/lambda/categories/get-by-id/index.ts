// src/lambda/categories/get-by-id/index.ts
import { APIGatewayProxyHandler } from 'aws-lambda'
import { PrismaClient } from '@amiller/prisma'

const prisma = new PrismaClient()

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id

    if (!id || isNaN(Number(id))) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid ID provided' })
      }
    }

    const category = await prisma.intentCategory.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        intents: {
          orderBy: {
            date: 'desc'
          }
        },
        _count: {
          select: { intents: true }
        }
      }
    })

    if (!category) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Category not found' })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}