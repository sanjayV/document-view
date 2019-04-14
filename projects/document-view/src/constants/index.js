export const CONSTANT = {
    STATUS_SUCCESS: 200,
    DEFAULT_OPTIONS: {
        containerId: 'root',
        data: [],
        maxWidth: 2000,
        maxHeight: 2000,
        videoControl: true,
        onComplete: () => { }
    },
    TYPE_REX: /(?:\.([^.]+))?$/,
    DOC_REX: /\/([\w-_]{15,})\/(.*?gid=(\d+))?/,
    SUPPORTED_IMAGE_TYPE: ['jpg', 'jpeg', 'png', 'gif'],
    SUPPORTED_DOC: ['pdf', 'google_doc'],
    SUPPORTED_VIDEO: ['mp4', 'mp3'],
    IMAGE_TYPE: 'image',
    DOC_TYPE: 'doc',
    VIDEO_TYPE: 'video',
    ERROR_TYPE: 'error'
};