export interface charParseConditionals {
  charIs: { encodedEmoji: boolean; unicode: boolean };
  charNotCompatibleWithLastArr: boolean;
  charToBePushedToArr: boolean;
  lastArrayInList: {
    includes: { encodedEmoji: boolean; unicodeChar: boolean };
    isUnicodePair: boolean;
  };
  listIsEmpty: boolean;
}
