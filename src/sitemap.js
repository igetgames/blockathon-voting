import Home from './pages/Home';
import Teams from './pages/Teams';
import Vote from './pages/Vote';
import VotingCategories from './pages/VotingCategories';

export default [
  {
    component: Home
  },
  {
    component: Teams,
    path: 'teams'
  },
  {
    component: VotingCategories,
    path: 'categories'
  },
  {
    component: Vote,
    path: 'vote'
  }
];
