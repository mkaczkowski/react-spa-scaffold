/** Code example returned by get_example tool. */
export interface CodeExample {
  pattern: string;
  description: string;
  filePath: string;
  code: string;
  keyPoints: string[];
}

/** Pattern definition mapping. */
export interface PatternDef {
  file: string;
  description: string;
  keyPoints: string[];
}

/** Pattern map type. */
export type PatternMap = Record<string, PatternDef>;
