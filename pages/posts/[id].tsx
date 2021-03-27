import Layout from '../../components/layout';
import Head from 'next/head';
import Date from '../../components/date';
import { getAllPostsId, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params.id as string);

    return {
        props: {
            postData
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostsId();

    return {
        paths,
        fallback: false
    }
}

export default function Post({ 
    postData
 }: {
    postData: {
        title: string
        date: string
        contentHTML: string
    }
 }) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
              <h1 className={utilStyles.headingXL}>{postData.title}</h1>
              <div className={utilStyles.lightText}>
                <Date dateString={postData.date} />
              </div>
              <div dangerouslySetInnerHTML={{__html: postData.contentHTML}} />
            </article>
        </Layout>
    )
}