export const getID = (path) => {
    const paths = path.split('/');
    return paths[paths.length - 1];
}