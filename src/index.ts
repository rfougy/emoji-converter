import {
  convertEmojis,
  charParser,
  createConditionalsForCharParse,
  encodeEmoji,
  decodeEmoji,
  containsNonLatinCodepoints,
} from "./emojiConversion";

console.log(convertEmojis("Hello World 🌎", "encode"));
