export const captureInfo = (params: {
  message: string;
  attributes?: Record<string, unknown>;
}): void => {
  const { message, attributes } = params;

  console.info(
    message + (attributes ? `, attributes:${JSON.stringify(attributes)}` : '')
  );
};

export const captureError = async (params: {
  messageOrError: string | Error;
}): Promise<void> => {
  const { messageOrError } = params;

  console.error(messageOrError);
};
