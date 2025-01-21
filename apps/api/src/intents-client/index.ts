import { PrismaClient } from '@amiller/prisma'

const prisma = new PrismaClient()

export const getAllCategories = async () => {
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

    return categoriesWithCount;
}

export const getCategoryById = async (id: string) => {
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
      return category;
}