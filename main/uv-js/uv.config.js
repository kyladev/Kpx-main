/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/uv/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/main/uv.handler.js',
    client: '/main/uv.client.js',
    bundle: '/main/uv.bundle.js',
    config: '/main/uv.config.js',
    sw: '/main/uv.sw.js',
};
