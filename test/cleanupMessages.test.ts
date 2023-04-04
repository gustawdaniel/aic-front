import { cleanupMessages, dropFuzzyMatchingFromArrayOfObjects } from '~/composables/cleanupMessages';
import { describe, it, expect } from "@jest/globals";
import { Gpt3Message } from "~/intefaces/Gpt3Interface";
// @ts-ignore
import { fuzzy } from "fast-fuzzy";
import { tooLongMessages } from "~/test/tooLongMessages";


describe('cleanupMessages', () => {
  it('should remove duplicates based on content key', () => {
    const messages: Gpt3Message[] = [
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'world'},
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'world'},
      {role: 'user', content: 'test'},
      {role: 'user', content: 'test'},
    ];

    const result = cleanupMessages(messages);

    expect(result).toEqual([
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'world'},
      {role: 'user', content: 'test'},
    ]);
  });

  it('should not remove anything if there are no duplicates', () => {
    const messages: Gpt3Message[] = [
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'world'},
      {role: 'user', content: 'foo'},
      {role: 'user', content: 'bar'},
      {role: 'user', content: 'baz'},
    ];

    const result = cleanupMessages(messages);

    expect(result).toEqual(messages);
  });

  it('should remove everything if all messages are duplicates', () => {
    const messages: Gpt3Message[] = [
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'hello'},
      {role: 'user', content: 'hello'},
    ];

    const result = cleanupMessages(messages);

    expect(result).toEqual([{role: 'user', content: 'hello'}]);
  });

  it('should return an empty array if input is empty', () => {
    const messages: Gpt3Message[] = [];

    const result = cleanupMessages(messages);

    expect(result).toEqual([]);
  });

  it('fuzzy', () => {
    expect(fuzzy('hello', 'helo')).toBeLessThan(0.9);
    expect(fuzzy('hello', 'helo')).toBeGreaterThan(0.75);
  });


  it('fuzzy real', () => {
    expect(fuzzy(
      '- Introduction: Explanation of HTTP and HTTPS_- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3_- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed_- Command to refresh the certificate automatically via crontab_- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security_- Recommendation to use TLS for security purposes_- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0_- Link to a guide for automatic certificate renewal from Let\'s Encrypt_- Usage statistics of HTTPS from Google\'s Transparency Report',
      '- Introduction: Explanation of HTTP and HTTPS__- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3__- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed__- Command to refresh the certificate automatically via crontab__- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security__- Recommendation to use TLS for security purposes__- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0__- Link to a guide for automatic certificate renewal from Let\'s Encrypt__- Usage statistics of HTTPS from Google\'s Transparency Report'
    )).toBeGreaterThan(0.75);
  });

  it('dropFuzzyMatchingFromArrayOfObjects', () => {
    expect(dropFuzzyMatchingFromArrayOfObjects<{ text: string }>([{
      text: 'hello'
    }, {
      text: 'helo',
    }, {
      text: 'moto'
    }], 'text')).toStrictEqual([{
      text: 'helo',
    }, {
      text: 'moto'
    }])
  })

  it('dropFuzzyMatchingFromArrayOfObjects single sentence', () => {
    expect(dropFuzzyMatchingFromArrayOfObjects<{ text: string }>([{
      text: '- Introduction: Explanation of HTTP and HTTPS_'
    }, {
      text: '- Introduction: Explanation of HTTP and HTTPS__',
    }], 'text')).toStrictEqual([{
      text: '- Introduction: Explanation of HTTP and HTTPS__'
    }])
  })

  it('dropFuzzyMatchingFromArrayOfObjects all sentence', () => {
    expect(dropFuzzyMatchingFromArrayOfObjects<{ text: string }>([{
      text: '- Introduction: Explanation of HTTP and HTTPS_- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3_- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed_- Command to refresh the certificate automatically via crontab_- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security_- Recommendation to use TLS for security purposes_- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0_- Link to a guide for automatic certificate renewal from Let\'s Encrypt_- Usage statistics of HTTPS from Google\'s Transparency Report'
    }, {
      text: '- Introduction: Explanation of HTTP and HTTPS__- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3__- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed__- Command to refresh the certificate automatically via crontab__- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security__- Recommendation to use TLS for security purposes__- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0__- Link to a guide for automatic certificate renewal from Let\'s Encrypt__- Usage statistics of HTTPS from Google\'s Transparency Report',
    }], 'text')).toStrictEqual([{
      text: '- Introduction: Explanation of HTTP and HTTPS__- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3__- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed__- Command to refresh the certificate automatically via crontab__- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security__- Recommendation to use TLS for security purposes__- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0__- Link to a guide for automatic certificate renewal from Let\'s Encrypt__- Usage statistics of HTTPS from Google\'s Transparency Report'
    }])
  });

  it('cleanupMessages on two sentences', () => {
    expect(cleanupMessages([{
      role: 'user',
      content: 'hello'
    }, {
      role: 'user',
      content: 'helo',
    }, {
      role: 'user',
      content: 'moto'
    }])).toStrictEqual([{
      role: 'user',
      content: 'helo',
    }, {
      role: 'user',
      content: 'moto'
    }])
  })


  it('should be shorten that original messages', () => {
    const clenMessages = cleanupMessages(tooLongMessages);
    const initialLength = JSON.stringify(tooLongMessages).length;
    const cleanLength = JSON.stringify(clenMessages).length;

    expect(clenMessages.length).toBeLessThan(tooLongMessages.length);
    expect(clenMessages.reverse()[0].content.startsWith('write title of this article')).toBeTruthy();

    // expect(clenMessages.map(c => c.content)).not.toContain('- Introduction: Explanation of HTTP and HTTPS\n- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3\n- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed\n- Command to refresh the certificate automatically via crontab\n- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security\n- Recommendation to use TLS for security purposes\n- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0\n- Link to a guide for automatic certificate renewal from Let\'s Encrypt\n- Usage statistics of HTTPS from Google\'s Transparency Report')
    // expect(clenMessages.map(c => c.content)).t
    // oContain('- Introduction: Explanation of HTTP and HTTPS\n\n- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3\n\n- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed\n\n- Command to refresh the certificate automatically via crontab\n\n- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security\n\n- Recommendation to use TLS for security purposes\n\n- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0\n\n- Link to a guide for automatic certificate renewal from Let\'s Encrypt\n\n- Usage statistics of HTTPS from Google\'s Transparency Report')
    expect(clenMessages.map(c => c.content)).toContain('- Introduction: Explanation of HTTP and HTTPS\n\n- Importance of cryptographic protocols, particularly TLS 1.2 and TLS 1.3\n\n- Installation process for a TLS certificate using certbot on Ubuntu with Apache installed\n\n- Command to refresh the certificate automatically via crontab\n\n- SSL versus TLS: differences in encryption algorithm, authentication protocols, versions, and security\n\n- Recommendation to use TLS for security purposes\n\n- Mention of POODLE attack and Mozilla\'s deprecation of SSL 3.0\n\n- Link to a guide for automatic certificate renewal from Let\'s Encrypt\n\n- Usage statistics of HTTPS from Google\'s Transparency Report')

    console.log('initialLength', initialLength);
    console.log('cleanLength', cleanLength);

    expect(cleanLength / initialLength).toBeLessThan(0.25);
  });
});
