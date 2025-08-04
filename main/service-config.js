self.__uv$config = {
    prefix: '/uv/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/main/handler.js',
    client: '/main/core-client.js',
    bundle: '/main/core-stack.js',
    config: '/main/service-config.js',
    sw: '/main/uv.sw.js',
};
