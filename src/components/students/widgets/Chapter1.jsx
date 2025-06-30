import React from 'react'
import { Link } from 'react-router-dom'

const Chapter1 = () => {
  return (
    <div className='p-4'>
      <div className="bg-white rounded-lg shadow overflow-auto mt-4 p-4">
          <span className="font-bold ">Chapter 1: Captions in Social Media</span>
          <div className="">
            <p>
              Welcome to Chapter 1! In this chapter, we'll dive into the world of "Captions in Social Media," something we encounter every single day. We'll learn how to understand, create, and even express our opinions through these short yet powerful pieces of text. Let's get started!
            </p>
            <div className="border my-4"></div>
            <span className="font-semibold">1.1. Vocabulary: Key Terms for Captions</span>
            <p className="mb-4">
              Before we go any further, let's enrich our vocabulary related to social media and captions. Understanding these words will help you grasp the meaning more easily and create effective captions.
            </p>
            <span className="font-medium">Important Vocabulary List:</span>
            <ul>
              <li className="mb-2"><span className="font-medium">Caption</span>: A brief description or title accompanying an image or video, typically on social media. Example: "Her caption for the sunset photo was very poetic."</li>
              <li className="mb-2"><span className="font-medium">Post</span> : (n.) An update or item published on social media; (v.) To publish something on social media. Example: "I saw your latest post about the concert." or "She decided to post a selfie."</li>
              <li className="mb-2"><span className="font-medium">Feed</span>: A constantly updated stream of content from people or pages you follow on social media. Example: "My feed is full of travel photos today."</li>
              <li className="mb-2"><span className="font-medium">Hashtag</span>: A word or phrase preceded by the symbol '#' used to categorize and find content on social media. Example: "Don't forget to use popular hashtags to reach more people."</li>
              <li className="mb-2"><span className="font-medium">Tag</span>: To mark someone in a social media post, so they are notified, and the post appears on their profile. Example: "He tagged all his friends in the group photo."</li>
              <li className="mb-2"><span className="font-medium">Engage</span>: To interact with content, such as liking, commenting on, or sharing. Example: "It's important to engage with your followers to build a community."</li>
              <li className="mb-2"><span className="font-medium">Follower</span>: Someone who subscribes to your social media account and sees your posts. Example: "She gained a lot of new followers after her video went viral."</li>
              <li className="mb-2"><span className="font-medium">Scroll</span>: To move up or down on a screen to view more content. Example: "I spent an hour just scrolling through Instagram."</li>
              <li className="mb-2"><span className="font-medium">Algorithm</span>: A set of rules used by social media platforms to determine what content is shown to users. Example: "The new algorithm changed how my posts are seen."</li>
              <li className="mb-2"><span className="font-medium">Viral</span>: Spreading quickly and widely on the internet. Example: "That cat video went viral within hours."</li>
              <li className="mb-2"><span className="font-medium">Insight</span>: Deep understanding or information about something. Example: "Social media platforms provide insights into your audience's behavior."</li>
              <li className="mb-2"><span className="font-medium">Reach</span>: The number of unique people who saw your content. Example: "The post had a wide reach, seen by thousands."</li>
              <li className="mb-2"><span className="font-medium">Impression</span>: The total number of times your content was displayed, including repeated views by the same user. Example: "My story had 500 impressions, but only 200 unique reach."</li>
              <li className="mb-2"><span className="font-medium">Direct Message (DM)</span>: A private message sent directly to another user; (v.) To send a private message. Example: "I'll send you a DM with the details." / "You can DM me if you have questions."</li>
              <li className="mb-2"><span className="font-medium">Story</span>: A feature on some social media platforms allowing users to post short photos or videos that disappear after 24 hours. Example: "She shared her travel adventures on her Instagram Story."</li>
              <li className="mb-2"><span className="font-medium">Profile</span>: A user's personal page on social media displaying their information and posts. Example: "Make sure your profile picture is clear."</li>
              <li className="mb-2"><span className="font-medium">Bio</span>: A short section on your profile that describes yourself. Example: "Her bio says she's a photographer and traveler."</li>
            </ul>
            <Link to='/dashboard-student/tasks'
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Do Task 1.1
            </Link>
            <div className="border my-4"></div>
            <span className="font-semibold">1.2. Contents: Expressiong Opinion (Agree & Disagree)</span>
            <p className="mb-4">
              One of the main purposes of captions is to spark interaction and discussion. Often, we see captions that contain opinions, and we might want to respond by stating our agreement or disagreement. Let's learn how to do that effectively and politely.
            </p>
            <span className="font-medium">Expressing Agreement</span>
            <p className="mt-2">
              When you agree with an opinion expressed in someone else's caption or comment, you can use the following phrases:
            </p>
            <ul className="mb-4">
              <li>
                <span className="font-medium">Strong Agreement</span>: "Absolutely!", "Exactly", "Definitely!", "I couldn't agree more.", "You're absolutely right", "That's so true!", "I completely agree with you."
              </li>
              <li>
                <span className="font-medium">General Agreement</span>: "I agree.", "I think so too.", "That's a good point.", "I supose so.", "You've got a point there.", "I see what you mean."
              </li>
            </ul>
            <span className="font-medium">Expressing Agreement</span>
            <ul className="mb-2">
              <li>Caption: "Cold weather is definitely better than hot weather for outdoor activities."</li>
              <li>Comment: "I'm not sure about that. I think hot weather makes swimming and beach activities more enjoyable."</li>
            </ul>
            <ul className="mb-2">
              <li>Caption: "Learning a new language is impossible without living in that country."</li>
              <li>Comment: "I see your point, but I believe it's still possible with consistent effort and online resources, even if you don't live there."</li>
            </ul>
            <ul className="mb-2">
              <li>Caption: "Coffee is the only drink you need to start your day."</li>
              <li>Comment: "I beg to differ. I find tea gives me a more sustained energy boost without the jitters."</li>
            </ul>
            <Link to='/dashboard-student/tasks'
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Do Task 1.2
            </Link>
          </div>
        </div>
    </div>
  )
}

export default Chapter1
