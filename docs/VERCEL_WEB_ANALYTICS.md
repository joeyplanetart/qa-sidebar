# Getting started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

**This project uses React (Create React App style) with Vite as the build tool**.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:
  
  **pnpm:**
  ```bash
  pnpm i vercel
  ```
  
  **yarn:**
  ```bash
  yarn add vercel
  ```
  
  **npm:**
  ```bash
  npm i vercel
  ```
  
  **bun:**
  ```bash
  bun add vercel
  ```

## Step 1: Enable Web Analytics in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Step 2: Add `@vercel/analytics` to your project

Using the package manager of your choice, add the `@vercel/analytics` package to your project:

**pnpm:**
```bash
pnpm i @vercel/analytics
```

**yarn:**
```bash
yarn add @vercel/analytics
```

**npm:**
```bash
npm i @vercel/analytics
```

**bun:**
```bash
bun add @vercel/analytics
```

## Step 3: Add the `Analytics` component to your app

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with React.

> **💡 Note:** When using the plain React implementation, there is no automatic route support. However, if you're using React Router or a similar routing solution, the Analytics component will detect page changes.

Add the following code to the main app file:

**TypeScript (src/main.tsx):**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Analytics />
    </ThemeProvider>
  </StrictMode>,
)
```

Alternatively, you can add it to your main App component:

**TypeScript (src/App.tsx):**
```tsx
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div>
      {/* Your app content */}
      <Analytics />
    </div>
  );
}

export default App;
```

## Step 4: Deploy your app to Vercel

Deploy your app using the following command:

```bash
vercel deploy
```

If you haven't already, we also recommend [connecting your project's Git repository](https://vercel.com/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

## Step 5: View your data in the dashboard

Once your app is deployed, and users have visited your site, you can view your data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Analytics** tab.

After a few days of visitors, you'll be able to start exploring your data by viewing and [filtering](https://vercel.com/docs/analytics/filtering) the panels.

Users on Pro and Enterprise plans can also add [custom events](https://vercel.com/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/analytics` package](https://vercel.com/docs/analytics/package)
- [Learn how to set up custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/analytics/troubleshooting)

## Advanced Configuration

### Custom Analytics Configuration

The `Analytics` component accepts optional configuration:

```tsx
<Analytics
  debug={false} // Enable debug mode in development
/>
```

### Environment-based Configuration

You can conditionally enable analytics based on the environment:

```tsx
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div>
      {/* Your app content */}
      {import.meta.env.PROD && <Analytics />}
    </div>
  );
}
```

This ensures analytics only run in production builds, not during local development.

## Troubleshooting

### Analytics not tracking

1. Ensure the Analytics component is rendered in your app
2. Check that you've deployed to Vercel and enabled Analytics in the dashboard
3. Open browser DevTools Network tab and look for requests to `/_vercel/insights/view`
4. Verify your app is deployed with the `@vercel/analytics` package installed

### TypeScript errors

If you encounter TypeScript errors, ensure you have the latest version of `@vercel/analytics`:

```bash
npm update @vercel/analytics
```

### Local development

Analytics will work in development mode but won't send data to Vercel. You can enable debug mode to see console logs:

```tsx
<Analytics debug={true} />
```

## Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Analytics Package API Reference](https://vercel.com/docs/analytics/package)
- [Custom Events Guide](https://vercel.com/docs/analytics/custom-events)
