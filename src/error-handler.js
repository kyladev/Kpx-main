export default function errorHandler(error, request, reply) {
  if (error.validation || error.code === 'FST_ERR_VALIDATION') {
    reply.code(400).type('text/html')
      .send('<h1>400 Bad Request</h1><p>Invalid request data.</p>');
  } else if (error.statusCode === 401) {
    reply.code(401).type('text/html')
      .send('<h1>401 Unauthorized</h1><p>You have not been authenticated to access this resource.</p>');
  } else if (error.message === 'UserNotAuthorized') {
    reply.code(403).type('text/html')
      .send("<h1>403 Forbidden</h1><p>You don't have permission to access this resource.</p>");
  } else if (error.code === 'FST_ERR_NOT_FOUND') {
    reply.code(404).type('text/html')
      .send('<h1>404 Not Found</h1><p>The resource does not exist.</p>');
  } else {
    reply.code(500).type('text/html')
      .send('<h1>500 Server Error</h1><p>An unexpected error occurred.</p>');
  }
}