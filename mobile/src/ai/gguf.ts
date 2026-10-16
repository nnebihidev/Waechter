/** GGUF files start with the ASCII magic "GGUF". */
export function isGgufHeader(bytes: ArrayLike<number>): boolean {
  return bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x47 && bytes[2] === 0x55 && bytes[3] === 0x46;
}
