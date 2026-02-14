import fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const prisma = new PrismaClient()

// Configuração do CORS 
app.register(cors, {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
})

// Rota: Criar Transação (POST)
app.post('/transactions', async (request, reply) => {
  const { title, amount, type, category } = request.body as any 

  const transaction = await prisma.transaction.create({
    data: {
      title,
      amount,
      type,
      category,
    }
  })

  return transaction
})

//Rota: Atualizar Transação (PUT)
app.put('/transactions/:id', async (request) => {
  const { id } = request.params as { id: string }
  const { title, amount, type, category } = request.body as any

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      title,
      amount,
      type,
      category
    }
  })

  return transaction
})

// Rota: Listar Todas (GET)
app.get('/transactions', async () => {
  const transactions = await prisma.transaction.findMany()
  return transactions
})

// Rota: Resumo (GET)
app.get('/summary', async () => {
  const transaction = await prisma.transaction.findMany()
  const summary = transaction.reduce((acc, transaction) => {
    if (transaction.type === 'credit') {
      acc.credit += transaction.amount
      acc.total += transaction.amount
    } else {
      acc.debit += transaction.amount
      acc.total -= transaction.amount
    }
    return acc
  }, { credit: 0, debit: 0, total: 0 })

  return summary
})

//Rota: Deletar (DELETE)
app.delete('/transactions/:id', async (request, reply) => {
  const { id } = request.params as { id: string }

  await prisma.transaction.delete({
    where: {
      id,
    }
  })

  return reply.status(204).send()
})

// Ligar o Servidor 
app.listen({ port: 3333 }).then(() => {
  console.log('Servidor rodando em http://localhost:3333')
})