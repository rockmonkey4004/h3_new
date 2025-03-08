import '../styles/globals.css';
import { MDXProvider } from '@mdx-js/react';
import Layout from '../components/layout/Layout';

// Custom components for MDX
const components = {
  // You can add custom components here that will be available in MDX files
  // For example: pre: (props) => <pre {...props} className="bg-gray-100 p-4 rounded" />
};

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level if available
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <MDXProvider components={components}>
      {getLayout(<Component {...pageProps} />)}
    </MDXProvider>
  );
}

export default MyApp; 