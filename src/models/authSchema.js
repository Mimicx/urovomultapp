import UUID from 'react-native-uuid';

export const AUTH_SCHEMA = "AuthSchema";
export const AuthSchema = {
    name: AUTH_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: { type: 'string', default: UUID.v4() },
        email: { type: 'string' },
        password: { type: 'string' },
        token: { type: 'string' },
        refreshToken: { type: 'string' },
    },
};