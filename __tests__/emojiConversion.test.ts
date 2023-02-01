import { charParseConditionals } from "../interfaces/charParseConditionals";
import {
  convertEmojis,
  charParser,
  createConditionalsForCharParse,
  encodeEmoji,
  decodeEmoji,
  containsNonLatinCodepoints,
} from "../src/emojiConversion";

describe("Lib: emojiConversion", () => {
  describe("Function: convertEmojis", () => {
    it("can encode emojis within a given string", () => {
      const arg: string = "👋Hello World!🌎🙋‍♂️";
      const result: string = convertEmojis(arg, "encode");
      const expectedResult: string =
        "#55357##56395#Hello World!#55356##57102##55357##56907##8205##9794##65039#";

      expect(result).toBe(expectedResult);
    });

    it("can decode emojis within a given string", () => {
      const arg =
        "#55357##56395#Hello World!#55356##57102##55357##56907##8205##9794##65039#";
      const result: string = convertEmojis(arg, "decode");
      const expectedResult: string = "👋Hello World!🌎🙋‍♂️";

      expect(result).toBe(expectedResult);
    });
  });

  describe("Function: charParser", () => {
    it("parses an emoji into its individual parts if applicable", () => {
      const arg: string = "🙋‍♂️";
      const result: string[] = charParser(arg);
      const expectedResult: string[] = ["\ud83d", "\ude4b", "‍", "♂", "️"];

      expect(result).toEqual(expectedResult);
    });
    it("distinguishes normal characters from emojis when parsing", () => {
      const arg: string = "hello🙋‍♂️world";
      const result: string[] = charParser(arg);
      const expectedResult: string[] = [
        "h",
        "e",
        "l",
        "l",
        "o",
        "\ud83d",
        "\ude4b",
        "‍",
        "♂",
        "️",
        "w",
        "o",
        "r",
        "l",
        "d",
      ];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("Function: createConditionalsForCharParse", () => {
    it("create conditionals to be used for charParser function", () => {
      const list: string[][] = [["h"], ["e"], ["l"], ["l"], ["o"], ["\ud83d"]];
      const char: string = "\ude4b";
      const lastArrInList: string[] = list[list.length - 1];

      const result = createConditionalsForCharParse(list, char, lastArrInList);
      const expectedResult: charParseConditionals = {
        charIs: { encodedEmoji: false, unicode: true },
        charNotCompatibleWithLastArr: true,
        charToBePushedToArr: true,
        lastArrayInList: {
          includes: { encodedEmoji: false, unicodeChar: true },
          isUnicodePair: false,
        },
        listIsEmpty: false,
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe("Function: encodeEmoji", () => {
    it("encodes an emoji or character of an emoji into its given codepoint inbetween hash symbols", () => {
      const arg: string = "🔥";
      const result: string = encodeEmoji(arg);
      const expectedResult: string = "#128293#";

      expect(result).toBe(expectedResult);
    });
  });

  describe("Function: decodeEmoji", () => {
    it("decodes a codepoint into an encoded emoji or character of an emoji", () => {
      const arg: string = "128293";
      const result: string = decodeEmoji(arg);
      const expectedResult: string = "🔥";

      expect(result).toBe(expectedResult);
    });
  });

  describe("Function: containsNonLatinCodepoints", () => {
    it("determines if a character in  non-latin codepoint", () => {
      let arg: string = "\ud83d";
      let result: boolean = containsNonLatinCodepoints(arg);
      let expectedResult: boolean = true;

      expect(result).toBe(expectedResult);

      arg = "🔥";
      result = containsNonLatinCodepoints(arg);
      expectedResult = true;

      expect(result).toBe(expectedResult);

      arg = "example";
      result = containsNonLatinCodepoints(arg);
      expectedResult = false;

      expect(result).toBe(expectedResult);
    });
  });
});
