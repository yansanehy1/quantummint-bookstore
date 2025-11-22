export const ForbiddenError = (message: string) => Object.assign(new Error(message), { status: 403, code: 'FORBIDDEN' });

export default {
  ForbiddenError,
};
