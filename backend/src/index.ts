// @ts-nocheck
import { Elysia, t } from 'elysia'
import { node } from '@elysiajs/node'
import { PrismaClient } from '@prisma/client'

// Initialize the Prisma Client here
import { PrismaClient } from './generated/prisma'

// Initialize the Prisma Client
const prisma = new PrismaClient() 

type WsData = {
    query: {
        userId: string
    }
}


const app = new Elysia({ adapter: node() })
	.get('/', async () => {
		return 'Hello Elysia'
	})
    
	.ws<any, WsData>('/ws/chat', { 
		query: t.Object({ userId: t.String() }),
        
		   async open(ws) {
		     const userId = ws.data.query.userId;
             
             try {
                const userWithChats = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { chats: { select: { id: true } } }
                });

                if (userWithChats) {
                    for (const chat of userWithChats.chats) {
                        const topic = chat.id;
                        ws.subscribe(topic);
                    }
                }
                
                ws.send(JSON.stringify({ type: 'STATUS', message: 'Connected and subscribed.' }));
                
             } catch (error) {
                 console.error('WebSocket open/subscription error:', error);
                 ws.close(1011, 'Subscription failed'); 
             }
		   },

		   async message(ws, message) {
		     const userId = ws.data.query.userId;
		     const parsedMessage = JSON.parse(message as string)
		     const { chatId, content } = parsedMessage;

             if (!chatId || !content) return;
             
		     try {
                 const createdMessage = await prisma.message.create({
                     data: {
                         content: content,
                         chatId: chatId,
                         senderId: userId,
                     },
                     include: { sender: { select: { id: true, name: true } } } 
                 });
                 
                 const broadcastMessage = JSON.stringify({
                     type: 'NEW_MESSAGE',
                     data: createdMessage,
                 });
                 
                 // Targeted broadcast to the specific chat ID
                 ws.publish(chatId, broadcastMessage);
                 
		     } catch (error) {
		       console.error('Error handling message:', error);
               ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to process message.' }));
		     }
		   },

		   async close(ws) {
		     const userId = ws.data.query.userId;
             
             try {
                 const userWithChats = await prisma.user.findUnique({
                     where: { id: userId },
                     select: { chats: { select: { id: true } } }
                 });
 
                 if (userWithChats) {
                     for (const chat of userWithChats.chats) {
                         ws.unsubscribe(chat.id);
                     }
                 }
             } catch (error) {
                 console.error('WebSocket close/unsubscription error:', error);
             }
		   },
		   
		   beforeHandle: ({ query, set }) => {
		     if (!query.userId) {
		       set.status = 401
		       return 'Unauthorized: Missing userId'
		     }
		   }
		 })
	
    
	.post('/chat', async ({ body, set }) => { 
		   const { userIds } = body as { userIds: string[] }
		   if (!userIds || userIds.length !== 2) {
		     set.status = 400
		     return 'Bad Request: Exactly two user IDs are required.'
		   }
	
		   try {
		     const chat = await prisma.chat.create({
		       data: {
		         users: {
		           connect: userIds.map(id => ({ id }))
		         }
		       }
		     })
		     return chat
		   } catch (error) {
		     set.status = 500
		     console.error('Error creating chat:', error)
		     return 'Internal Server Error'
		   }
		 })
		 
		 .get('/chat/:chatId/messages', async ({ params, set }) => {
		   const { chatId } = params
		   try {
		     const messages = await prisma.message.findMany({
		       where: { chatId },
		       orderBy: { createdAt: 'asc' },
		       include: { sender: true }
		     })
		     return messages
		   } catch (error) {
		     set.status = 500
		     console.error('Error fetching messages:', error)
		     return 'Internal Server Error'
		   }
		 })
		 
		 .get('/chat/user/:userId', async ({ params, set }) => {
		   const { userId } = params
		   try {
		     const userWithChats = await prisma.user.findUnique({
		       where: { id: userId },
		       include: {
		         chats: {
		           include: { users: true }
		         }
		       }
		     })
		     if (!userWithChats) {
		       set.status = 404
		       return 'User not found.'
		     }
		      return userWithChats.chats
		    } catch (error) {
		      set.status = 500
		      console.error('Error fetching user chats:', error)
		      return 'Internal Server Error'
		   }
		})

	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})