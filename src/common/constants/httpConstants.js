module.exports = {
  OK_STATUS: { code: 200, description: 'OK' },
  CREATED_STATUS: { code: 201, description: 'CREATED' },
  NO_CONTENT_STATUS: { code: 204, description: 'NO CONTENT' },

  BAD_REQUEST_STATUS: { code: 400, description: 'BAD REQUEST' },
  UNAUTHORIZED_STATUS: { code: 401, description: 'UNAUTHORIZED' },
  FORBIDDEN_STATUS: { code: 403, description: 'FORBIDDEN' },
  NOT_FOUND_STATUS: { code: 404, description: 'NOT FOUND' },
  UNPROCESSABLE_ENTITY_STATUS: { code: 422, description: 'UNPROCESSABLE ENTITY' },

  INTERNAL_SERVER_ERROR_STATUS: { code: 500, description: 'INTERNAL SERVER ERROR' },
  BAD_GATEWAY_STATUS: { code: 502, description: 'BAD GATEWAY' },
  GATEWAY_TIMEOUT_STATUS: { code: 504, description: 'GATEWAY TIMEOUT' },
  REQUEST_CHANNELS: { CHANNEL01: 'WEB', CHANNEL02: 'AWS' },
};
