import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // get the file name under posts
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map(fileName => {

        // remove md from file name to use as ID
        const id = fileName.replace(/\.md$/, '');

        // read MD file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContent = fs.readFileSync(fullPath, 'utf-8');

        // use gray matter to parse the metadata in the header
        const matterResult = matter(fileContent);

        // combine the matter data with the id generated above
        // returning an object with two properties
        return {
            id,
            ...(matterResult.data as { date: string; title: string })
        }
    })

    // sort posts by date
    return allPostsData.sort((a,b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostsId() {
    const fileNames = fs.readdirSync(postsDirectory);

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]

    return fileNames.map(fileName => {
        return {params: {id: fileName.replace(/.md$/, '')}}
    })
}

export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');

    // parse the file metadata with gray matter
    const matterResult = matter(fileContents);


    // use remark to parse the markdown; returns an html string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHTML = processedContent.toString()


    // combine the HTML content with id and file metadata
    return {
        id,
        contentHTML,
        ...(matterResult.data as { date: string; title: string})
    }
}