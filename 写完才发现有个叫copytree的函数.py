# 遍历一个文件夹内容到另一个文件夹下, 对每一个文件执行一个回调
def traverse(src: str, dest: str, cb: Callable[[str, str], None]) -> None:
    src = abspath(src)
    dest = abspath(dest)
    srcLen = len(src)
    if isdir(src) and isdir(dest):
        def recurse(path: str):
            names = listdir(path)
            for name in names:
                srcPath = abspath(join(path, name))
                if isdir(srcPath):
                    recurse(srcPath)
                else:
                    destPath = dest + srcPath[srcLen:]
                    destDir = dirname(destPath)
                    if not exists(destDir):
                        makedirs(destDir, exist_ok=True)
                    cb(srcPath, destPath)
        recurse(src)
