path = r"components\shared\safety-button.tsx"
bad = "motion" + "lessModal"
good = chr(100) + chr(105) + chr(118)
with open(path, encoding="utf-8") as f:
    text = f.read()
text = text.replace(bad, good)
with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("remaining bad tags:", text.count(bad))
