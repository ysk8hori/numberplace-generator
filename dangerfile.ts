import { message, danger } from 'danger';
import typescriptGraph from 'danger-plugin-typescript-graph';

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);
typescriptGraph();
