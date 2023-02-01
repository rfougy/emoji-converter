import { charParseConditionals } from "../interfaces/charParseConditionals";

/**
 * @description encodes or decodes all emojis within a given string, depending on the the second argument that is passed. Refer to unit tests for more information.
 * @reference https://arayofsunshine.dev/blog/convert-emoji-character-to-unicode-number-in-javascript
 *
 * @example (ENCODING) input = "👋Hello World!🌎🙋‍♂️" --> output = "#55357##56395#Hello World!#55356##57102##55357##56907##8205##9794##65039#"
 * @example (DECODING) input = "#55357##56395#Hello World!#55356##57102##55357##56907##8205##9794##65039#" --> output = "👋Hello World!🌎🙋‍♂️"
 */
export function convertEmojis(
  str: string,
  conversionType: "encode" | "decode"
): string {
  const wordList: string[] = str.split(" ");

  const listWithEmojisConverted: string[] = wordList.map(
    (word: string): string => {
      const parsedWord: string[] = charParser(word);

      const wordWithEmojisConverted: string = parsedWord
        .map((w: string): string => {
          const wordIncludesEmoji: boolean = containsNonLatinCodepoints(w);
          const wordIncludesEncodedEmoji: boolean = !!parseInt(w);

          if (conversionType === "encode" && wordIncludesEmoji)
            return encodeEmoji(w);

          if (conversionType === "decode" && wordIncludesEncodedEmoji)
            return decodeEmoji(w);

          return w;
        })
        .join("");

      return wordWithEmojisConverted;
    }
  );

  const strWithEmojisConverted: string = listWithEmojisConverted.join(" ");

  return strWithEmojisConverted;
}

/**
 * @example input = "hello🙋‍♂️" --> output = ["h", "e", "l", "l", "o", "\ud83d", "\ude4b"]
 * @author Riviere Fougy
 */
export function charParser(word: string): string[] {
  const charList: string[] = word.includes("#")
    ? word.split("#").filter((char) => char.length)
    : word.split("");
  const listOfEmojisAndChars: string[][] = charList.reduce(
    (list: string[][], char: string): string[][] => {
      const lastArrInList: string[] = list[list.length - 1];

      const {
        listIsEmpty,
        lastArrayInList,
        charNotCompatibleWithLastArr,
        charToBePushedToArr,
      } = createConditionalsForCharParse(list, char, lastArrInList);

      if (
        listIsEmpty ||
        charNotCompatibleWithLastArr ||
        lastArrayInList.isUnicodePair
      ) {
        list.push([char]);
        return list;
      }

      if (charToBePushedToArr) {
        lastArrInList.push(char);
        return list;
      }

      return list;
    },
    []
  );

  const joinedListOfEmojisAndChars: string[] = listOfEmojisAndChars.map(
    (charSet: string[]) => charSet.join("")
  );

  return joinedListOfEmojisAndChars;
}

export function createConditionalsForCharParse(
  list: string[][],
  char: string,
  lastArrInList: string[]
): charParseConditionals {
  const conditionalsDictionary: charParseConditionals = {
    listIsEmpty: !list.length,
    charIs: {
      unicode: containsNonLatinCodepoints(char),
      encodedEmoji: !!parseInt(char),
    },
    lastArrayInList: {
      includes: {
        unicodeChar:
          lastArrInList &&
          lastArrInList.some((char: string): boolean =>
            containsNonLatinCodepoints(char)
          ),
        encodedEmoji:
          lastArrInList &&
          lastArrInList.some((char: string): boolean => !!parseInt(char)),
      },
      get isUnicodePair() {
        return (
          lastArrInList &&
          this.includes.unicodeChar &&
          lastArrInList.length === 2
        );
      },
    },
    get charNotCompatibleWithLastArr() {
      return (
        this.listIsEmpty ||
        (this.charIs.unicode && !this.lastArrayInList.includes.unicodeChar) ||
        (!this.charIs.unicode && this.lastArrayInList.includes.unicodeChar) ||
        this.charIs.encodedEmoji ||
        !this.charIs.encodedEmoji
      );
    },
    get charToBePushedToArr() {
      return (
        (!this.charIs.unicode && !this.lastArrayInList.includes.unicodeChar) ||
        (this.charIs.unicode && this.lastArrayInList.includes.unicodeChar)
      );
    },
  };

  return conditionalsDictionary;
}

/**
 * @example input = "🔥" --> output = "#128293#"
 */
export function encodeEmoji(decodedEmoji: string): string {
  const encodedEmoji: string | undefined =
    "#" + decodedEmoji.codePointAt(0) + "#";
  return encodedEmoji;
}

/**
 * @example input = "128293" --> output = "🔥"
 */
export function decodeEmoji(encodedEmoji: string): string {
  const numberFromUnicode: number = parseInt(encodedEmoji);
  const decodedEmoji: string = String.fromCodePoint(numberFromUnicode);
  return decodedEmoji;
}

/**
 *
 * @example input = "\ud83d" --> output = true
 * @example input = "example" --> output = false
 */
export function containsNonLatinCodepoints(arg: string): boolean {
  return /[^\u0000-\u00ff]/.test(arg);
}
