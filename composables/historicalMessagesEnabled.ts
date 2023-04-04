export const useHistoricalMessagesEnabled = () => {
  return useState<boolean>('historical-messages-enabled', () => false);
}
