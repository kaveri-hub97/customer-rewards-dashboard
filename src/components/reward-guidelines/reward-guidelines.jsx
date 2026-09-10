import {
  FIRST_REWARD_LIMIT,
  SECOND_REWARD_LIMIT
} from '../../constants/app-constants';
// This component is used to display the reward guidelines. It is used in the AnnualRewards component.
const RewardGuidelines = () => {
  return (
    <section className="side-card reward-guidelines-card">
      <h2>Reward Guidelines</h2>

      <div className="rule-row">
        <span>
          $0 - ${FIRST_REWARD_LIMIT}
        </span>

        <strong>0 points</strong>
      </div>

      <div className="rule-row">
        <span>
          Above ${FIRST_REWARD_LIMIT} - ${SECOND_REWARD_LIMIT}
        </span>

        <strong>1 point per $1</strong>
      </div>

      <div className="rule-row">
        <span>
          Above ${SECOND_REWARD_LIMIT}
        </span>

        <strong>2 points per $1</strong>
      </div>
    </section>
  );
};

export default RewardGuidelines;