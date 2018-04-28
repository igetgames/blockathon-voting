import Home from './pages/Home';
import Teams from './pages/Teams';
import Vote from './pages/Vote';
import VotingCategories from './pages/VotingCategories';

export default [
  {
    component: Home,
    label: 'Home'
  },
  {
    component: Teams,
    path: 'teams',
    label: 'Teams'
  },
  {
    component: VotingCategories,
    path: 'categories',
    label: 'Categories'
  },
  {
    component: Vote,
    path: 'vote',
    label: 'Vote'
  }
];
