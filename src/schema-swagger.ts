export const userSchema = {
    type: 'object',
    required: ['nome', 'email', 'idade'],
    properties: {
        id: { type: 'number' },
        nome: { type: 'string' },
        email: { type: 'string' },
        idade: { type: 'number' },
    }
}
