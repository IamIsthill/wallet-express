export const codes = {
    // 2xx Success
    OK: 200,             // General success
    CREATED: 201,         // Resource created
    ACCEPTED: 202,        // Request accepted for processing
    NO_CONTENT: 204,      // No content to send back
    RESET_CONTENT: 205,   // Reset the view that presented the request
    PARTIAL_CONTENT: 206, // Partial content for a range of the resource
    // 3xx Redirection
    MOVED_PERMANENTLY: 301,  // Moved permanently
    FOUND: 302,            // Found (Moved temporarily)
    SEE_OTHER: 303,        // See other
    NOT_MODIFIED: 304,     // Not modified
    TEMPORARY_REDIRECT: 307, // Temporary redirect
    PERMANENT_REDIRECT: 308,  // Permanent redirect
    // 4xx Client Error
    BAD_REQUEST: 400,       // Bad request
    UNAUTHORIZED: 401,      // Unauthorized
    PAYMENT_REQUIRED: 402,    // Payment required (reserved for future use)
    FORBIDDEN: 403,         // Forbidden
    NOT_FOUND: 404,         // Not found
    METHOD_NOT_ALLOWED: 405,  // Method not allowed
    NOT_ACCEPTABLE: 406,     // Not acceptable
    PROXY_AUTHENTICATION_REQUIRED: 407, // Proxy authentication required
    REQUEST_TIMEOUT: 408,      // Request timeout
    CONFLICT: 409,          // Conflict
    GONE: 410,              // Gone
    LENGTH_REQUIRED: 411,     // Length required
    PRECONDITION_FAILED: 412,    // Precondition failed
    PAYLOAD_TOO_LARGE: 413,     // Payload too large
    URI_TOO_LONG: 414,         // URI too long
    UNSUPPORTED_MEDIA_TYPE: 415,  // Unsupported media type
    RANGE_NOT_SATISFIABLE: 416,   // Range not satisfiable
    EXPECTATION_FAILED: 417,      // Expectation failed
    I_AM_A_TEAPOT: 418,         // I'm a teapot (RFC 2324)
    MISDIRECTED_REQUEST: 421,       // Misdirected Request
    UNPROCESSABLE_ENTITY: 422,    // Unprocessable Entity (WebDAV)
    LOCKED: 423,            // Locked (WebDAV)
    FAILED_DEPENDENCY: 424,     // Failed Dependency (WebDAV)
    UPGRADE_REQUIRED: 426,        // Upgrade Required
    PRECONDITION_REQUIRED: 428,     // Precondition Required
    TOO_MANY_REQUESTS: 429,       // Too Many Requests
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // Request Header Fields Too Large
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,  // Unavailable For Legal Reasons
    // 5xx Server Error
    INTERNAL_SERVER: 500,       // Internal server error
    NOT_IMPLEMENTED: 501,       // Not implemented
    BAD_GATEWAY: 502,         // Bad gateway
    SERVICE_UNAVAILABLE: 503,     // Service unavailable
    GATEWAY_TIMEOUT: 504,         // Gateway timeout
    HTTP_VERSION_NOT_SUPPORTED: 505,  // HTTP version not supported
    VARIANT_ALSO_NEGOTIATES: 506,      // Variant Also Negotiates (Experimental)
    INSUFFICIENT_STORAGE: 507,       // Insufficient Storage (WebDAV)
    LOOP_DETECTED: 508,          // Loop Detected (WebDAV)
    NOT_EXTENDED: 510,           // Not Extended (HTTP Extension Framework)
    NETWORK_AUTHENTICATION_REQUIRED: 511 // Network Authentication Required
  };
  