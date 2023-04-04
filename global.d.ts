import 'jest-extended';

// https://stackoverflow.com/a/59499895/6277151
import payloadClient from "#app/plugins/payload.client.mjs";
import {GoogleLoginCallbackPayload} from "~/intefaces/GoogleLoginCallbackPayload";

export {}

declare global {
    interface Window {
        __NUXT__: any
        googleLoginCallback: (payloadClient: GoogleLoginCallbackPayload) => void
    }
}
