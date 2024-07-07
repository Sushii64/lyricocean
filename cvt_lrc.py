def lrcToStr(lrc: str) -> str:
    return f"lyrics: '{lrc
                       .replace("\n", "\\n")
                       .replace("\"", "\\\"")
                       .replace(" ", " ")
                       .replace(" ", " ")
                       .replace("е", "e")}',"

if __name__ == "__main__":
    with open('cvt_lrc.txt', 'r') as f:
        lrc = f.read()
    with open('cvt_lrc.txt', 'w') as f:
        f.write(lrcToStr(lrc))
        f.close()
    print("Finished!")