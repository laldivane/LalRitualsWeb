/**
* This configuration file is used by the Sanity CLI to configuration project ID and dataset,
* and for specifying the studio output directory.
*
* Note: Sanity CLI version 3 or higher is required.
*/

import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {
    projectId,
    dataset
  }
})
