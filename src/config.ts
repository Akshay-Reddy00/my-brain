import 'dotenv/config';

export const JWT_PASSWORD = `${process.env.JWT_PASSWORD}`;

export const SIGNUP = '/api/v1/signup';
export const SIGNIN = '/api/v1/signin';
export const POST_CONTENT = '/api/v1/content';
export const GET_CONTENT = '/api/v1/content';
export const DELETE_CONTENT = '/api/v1/content';
export const SHARE_CONTENT = '/api/v1/brain/share';
export const GET_SHARED_CONTENT = '/api/v1/brain/:shareLink';
export const DELETE_USER = '/api/v1/delete';