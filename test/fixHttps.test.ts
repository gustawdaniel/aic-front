import {expect, it} from "@jest/globals";
import {addHttps} from '~/composables/helpers'

it('addHttps', () => {
    expect(addHttps('https://http://gustawdaniel.com')).toEqual('https://gustawdaniel.com');
})
