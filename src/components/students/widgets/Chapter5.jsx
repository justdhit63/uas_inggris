import React from 'react'
import { Link } from 'react-router-dom'

const Chapter5 = () => {
  return (
    <div className='p-4'>
      <div className="bg-white rounded-lg shadow overflow-auto mt-4 p-4">
          <span className="font-bold">Chapter 5: Personal Money Management</span>
          <p>Welcome to Unit 5! This chapter will help you understand the importance of financial literacy by focusing on Procedure Texts. You'll learn how to give clear, step-by-step instructions on managing money, saving wisely, and building responsible financial habits in your everyday life.</p>
          <div className="border my-4"></div>
          <span className="font-semibold">How to Change your PIN</span>
          <ul>
            <li className="mb-1">Step 1. Visit the nerby ATM.</li>
            <li className="mb-1">Step 2. Insert your card into the ATM machine and select the language from the menu displayed.</li>
            <li className="mb-1">Step 3. Insert your card into the ATM machine and select the language from the menu displayed.</li>
            <li className="mb-1">Step 4. After that select the PIN change option from the main menu.</li>
            <li className="mb-1">Step 5. A text will be	displayed on the ATM screen, “Please enter	your new PIN”. Type your new ATM PIN.</li>
            <li className="mb-1">Step 6. A new	screen	appears, with	a text,	“Please	re-enter your new PIN”. Type your new PIN again.</li>
            <li className="mb-1">Step 7. Make sure that	 you type the PIN correctly the second time.	A new screen appears “Your PIN has been changed successfully”.</li>
          </ul>
          <div className="border my-4"></div>
          <span className="font-semibold">1. What is Procedure Text?</span>
          <p className="mb-4">A Procedure Text is a type of text that gives step-by-step instructions on how to do something. It helps the reader perform a task correctly, safely, and efficiently. This type of text is commonly used in recipes, manuals, guides, and everyday tasks — like changing your PIN.</p>
          <span className="font-semibold">2. Why Do We Use It?</span>
          <p className="mb-4">The social function of a procedure text is to instruct or guide the reader to complete a task successfully. In this unit, procedure texts are used to help you: •	Handle financial tools and technology, Perform safe money-related operations, Build independance and responsibility with money.</p>
          <span className="font-semibold">3. How Do We Write It? (Language Features)</span>
          <table className="min-w-full divide-y divide-gray-200 my-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language Feature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4">Imperative Verbs</td>
                <td className="px-6 py-4">Used to give instuctions</td>
                <td className="px-6 py-4">“Insert your card.”</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Action Verbs</td>
                <td className="px-6 py-4">Show clear actions to follow</td>
                <td className="px-6 py-4">“Select,” "Enter",” "Re-enter"</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Sequencing Words</td>
                <td className="px-6 py-4">Show order of steps</td>
                <td className="px-6 py-4">“First," “Then,” "After that," "Finally"</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Adverbs of Manner/Time</td>
                <td className="px-6 py-4">Indicate how/when to do something</td>
                <td className="px-6 py-4">“Carefully insert your card into the machine.”</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Technical Vocabulary (Finance)</td>
                <td className="px-6 py-4">Uses terms related to banking and technology</td>
                <td className="px-6 py-4">"PIN",” "ATM",” "Transaction",” "Security"</td>
              </tr>
            </tbody>
          </table>
          <span className="font-semibold">4. Text Structure</span>
          <table className="min-w-full divide-y divide-gray-200 my-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4">Heading</td>
                <td className="px-6 py-4">Indicates the title or goal of the procedure</td>
                <td className="px-6 py-4">How to Change Your PIN</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Section</td>
                <td className="px-6 py-4">Organizes the text into clear parts for easier reading</td>
                <td className="px-6 py-4">Divided into: Materials, Steps</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Subheading</td>
                <td className="px-6 py-4">Indicates each stage of the procedure (such as materials, warning, steps)</td>
                <td className="px-6 py-4">
                  <ul>
                    <li className="mb-1">Materials: ATM card</li>
                    <li className="mb-1">Steps: 7 Ordered Instructions</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">Sequence</td>
                <td className="px-6 py-4">Each new step starts on a new line in chronological order</td>
                <td className="px-6 py-4">
                  <ul>
                    <li className="mb-1">1. Visit the nearby ATM.</li>
                    <li className="mb-1">2. Insert your card and select the language.</li>
                    <li className="mb-1">3. Enter your PIN.</li>
                    <li className="mb-1">4. Select "PIN Change".</li>
                    <li className="mb-1">5. Enter new PIN.</li>
                    <li className="mb-1">6. Re-enter new PIN.</li>
                    <li className="mb-1">7. Confirmation message appears.</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <Link to='/dashboard-student/tasks'
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Do Task 5
          </Link>
        </div>
    </div>
  )
}

export default Chapter5
