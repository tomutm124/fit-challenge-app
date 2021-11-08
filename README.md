# fit-challenge-app
A mobile application to gamify healthy lifestyle in the form of challenges between friends

## How it works
- Each challenge is one-on-one and lasts several days
- Every day, the participants record what they eat, what exercise they have done, and how many steps they have walked during the day
- Each item is converted into a score
  - For each meal and exercise, each user can upload a photo and a text description, 
  then both participants give a score to the item and the average score becomes the item's final score
  - Number of steps is converted to score by a user-defined formula like "1 point per 1000 steps", 
    - Score is rounded down to encourage walking extra steps when the number is close to the next cutoff (e.g. 3800 -> walk extra 200 steps to make it 4000)
- Scores are cumulated over the period of the challenge, the person with the higher score when the challenge ends is the winner

## Highlights
- Score calculation is customizable when the user creates the challenge
  - A user can get an advantage by having their scores scaled up by a factor (e.g. 1.1)
    - This levels the playing field for users with less healthy lifestyles so that they can gradually catch up with friends
    - **This is the key motivation behind building this app** for my friend and myself since I can't find similar features in existing challenge apps
  - Importance of each meal is determined by its max score
    - e.g. if I think lunch is more important than breakfast, I can set the max score for lunch to be 10 and that for breakfast to be 5, 
    so a healthy lunch (e.g. 9 points) will have a larger impact on the total score than a healthy breakfast (e.g. 4.5 points)
  - Formula for step calculation is also customizable
- Learn about one another's view of healthy lifestyle
  - Each item is scored by both participants. This scoring method cancels out differences in scoring standards and encourages discussion regarding how healthy a meal/exercise is
- Share the joy of one another's meals
  - Look at the photos and cheer your friend up for having a healthy and nice meal :)

## How it looks
<screenshots arranged horizontally>

## About the system
<system diagram and explanation>

## Notes
- Currently deployed on Expo Go and used by a friend and myself
