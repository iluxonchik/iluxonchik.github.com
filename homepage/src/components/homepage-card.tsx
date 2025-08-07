'use client'

import { useState } from 'react'
import { m, motion } from 'framer-motion'
import { Github, Mail, Send, ExternalLink, QrCode, Twitter } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { seoLd } from "../seoLd"

export function HomepageCard() {
  const [activeTab, setActiveTab] = useState('👋')
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoLd, null, 2) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full"
      >
        <div className="md:flex">
          <div className="md:w-1/3 bg-gray-100 pt-3 px-8 pb-4 flex flex-col items-center justify-center">
            <img
              src="/profile-2.png?height=200&width=200"
              alt="Illya Gerasymchuk"
              className="rounded-full w-40 h-40 object-cover border-4 border-purple-500 shadow-lg"
            />
            <h1 className="text-2xl font-bold mt-4 text-center">Illya Gerasymchuk</h1>
            <p className="text-gray-600 text-center">Entrepreneur/Engineer</p>
            <div className="flex mt-4 space-x-4">
              <a href="https://github.com/iluxonchik/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-500 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="mailto:hello@illya.sh" className="text-gray-600 hover:text-purple-500 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
              {/* <a href="https://t.me/illya_gerasymchuk" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-500 transition-colors">
                <Send className="w-6 h-6" />
              </a> */}
              <a href="https://x.com/illyaGera" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
    
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-gray-600 hover:text-purple-500 transition-colors">
                    <QrCode className="w-6 h-6" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">⬇️ My Contact QR Code ⬇️</h3>
                    <div className="mt-2">
                      <img
                        src="/illya-gerasymchuk-qr-vcard.svg?height=300&width=300"
                        alt="QR Code"
                        className="mx-auto"
                      />
                      <p className="text-sm text-gray-600">⬆️ Scan to add me to your contacts ⬆️️</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 flex flex-row gap-1.5 w-full max-w-xs md:flex-col md:gap-1.5">
              <Button asChild className="px-2 py-1.5 flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 ease-in-out text-xs sm:text-sm sm:px-3 sm:py-2 md:text-sm">
                <a href="https://illya.sh/thoughts" target="_blank" rel="noopener">
                  💭 My Thoughts
                </a>
              </Button>
              <Button asChild className="px-2 py-1.5 flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 ease-in-out text-xs sm:text-sm sm:px-3 sm:py-2 md:text-sm">
                <a href="https://illya.sh/threads" target="_blank" rel="noopener">
                  🧵 My Threads
                </a>
              </Button>
            </div>
          </div>
          <div className="md:w-2/3 p-4 md:p-8">
            <Tabs defaultValue="👋" onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-1 mb-4">
                {['👋', '🚀', '✏️', '🎓', '🌟'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 whitespace-nowrap data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 hover:bg-purple-50"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="👋">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-black-700">👋😀 Hello,</h2>
                  <p className="text-gray-700">
                    My name is Illya, and I like solving problems in finance, governance & digital privacy.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-black-600 mb-2">Current efforts include:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-2xl mr-2">🏦</span>
                        <span>
                          <strong className="text-black-600">TradFi ➡️ DeFi</strong> - towards a more efficient, transparent & decentralized financial system
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl mr-2">👩‍⚖️</span>
                        <span>
                          <strong className="text-black-600">Legal Smart Contracts</strong> - towards a more transparent, automated, and efficient legal system & governance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl mr-2">0️⃣</span>
                        <span>
                          <strong className="text-black-600">Zero Knowledge Proofs</strong> - towards a privacy-first future, and client-side verifiable computation models
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl mr-2">🤖</span>
                        <span>
                          <strong className="text-black-600">Generative AI</strong> - towards the democratization of information & natural language programmability
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 mt-4">
                    You can reach out to me at <a href="mailto:hello@illya.sh" className="text-purple-600 hover:underline">hello@illya.sh</a>
                    <p>You can find my CV/Resume at <a href="https://illya.sh/cv-resume/" className="text-purple-600 hover:underline">illya.sh/cv-resume</a></p>
                  </p>
                </motion.div>
              </TabsContent>
              <TabsContent value="🚀">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">🚀 Currently Shipping</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">zkLocus</h3>
                        <p className="text-sm text-gray-600">Authenticated, private & programmable geolocation on-chain using ZKP.</p>
                      </div>
                      <a
                        href="https://zklocus.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors flex items-center"
                      >
                        👀
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">zkSafeZones</h3>
                        <p className="text-sm text-gray-600">Civilian protection in conflict areas using Mina Protocol blockchain & ZKP.</p>
                      </div>
                      <a
                        href="https://zklocus.dev/zkSafeZones/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors flex items-center"
                      >
                        👀
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Mina Foundation GovBot</h3>
                        <p className="text-sm text-gray-600">On-chain governance for Mina Protocol community voting.</p>
                      </div>
                      <a
                        href="https://github.com/MinaFoundation/PGT_govbot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors flex items-center"
                      >
                        👀
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="✏️">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">✏️ My Writings</h2>
                  <p className="text-gray-600 text-sm mb-6 italic">
                    Below is a curated selection of my recent articles. For a complete list, visit{' '}
                    <a 
                      href="https://illya.sh/blog/" 
                      target="_blank" 
                      rel="noopener" 
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      illya.sh/blog
                    </a>, {' '}
                    <a 
                      href="https://illya.sh/threads" 
                      target="_blank" 
                      rel="noopener" 
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      illya.sh/threads
                    </a> and {' '}
                    <a 
                      href="https://illya.sh/thoughts" 
                      target="_blank" 
                      rel="noopener" 
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      illya.sh/thoughts
                    </a>
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Technical</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="https://illya.sh/blog/posts/zksnark-zkstark-verifiable-computation-model-blockchain/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 transition-colors">
                            zkSNARKs & zkSTARKs: A Novel Verifiable Computation Model
                          </a>
                        </li>
                        <li>
                          <a href="https://illya.sh/blog/posts/zk-snarks-recursive-proof-private-intput-visibility/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 transition-colors">
                            Recursive zkSNARKs & Private Input Visibility
                          </a>
                        </li> 
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Blockchain & Privacy</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="https://illya.sh/blog/posts/privacy-is-a-myth-without-zero-knowledge-proofs/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 transition-colors">
                            Privacy Is A Myth. Unless You're Using Zero-Knowledge Proofs
                          </a>
                        </li>
                        <li>
                          <a href="https://illya.sh/blog/posts/zklocus-authenticated-geolocation-blockchain-zk/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 transition-colors">
                            zkLocus: Authenticated Private Geolocation Off & On-Chain
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Finance</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="https://illya.sh/blog/posts/brics-cryptocurrency-blockchain/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 transition-colors">
                            BRICS Digital Currency: Cryptocurrency On A Public Blockchain
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Legal</h3>
                      <ul className="space-y-2">
                        <li>
                          <a href="https://illya.sh/blog/posts/deposit-guarantee-scheme-japan-dia-dicj/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 transition-colors">
                          Deposit Guarantee Scheme of Japan: DIA & DICJ
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="🎓">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">🎓 Academia</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-m mr-3">⚖️</span>
                      <div>
                        <h3 className="font-medium">Master's in Law & Financial Markets</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="mr-1">🔄</span> Currently pursuing
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-m mr-3">💻</span>
                      <div>
                        <h3 className="font-medium">Master's in Software Engineering and Distributed Systems</h3>
                        <p className="text-sm text-gray-600">Instituto Superior Técnico (IST), Lisbon, Portugal</p>
                        <a 
                          href="https://fenix.tecnico.ulisboa.pt/downloadFile/1126295043836553/Thesis.pdf" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:text-purple-700 transition-colors text-sm flex items-center mt-1"
                        >
                          <span className="mr-1">📄</span> Master Thesis: TLS For Internet of Things
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-m mr-3">🌐</span>
                      <div>
                        <h3 className="font-medium">Bachelor's in Software and Computer Engineering</h3>
                        <p className="text-sm text-gray-600">Instituto Superior Técnico (IST), Lisbon, Portugal</p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </TabsContent>
              <TabsContent value="🌟">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">🌟 Contributions</h2>
                  <div className="space-y-4"> 
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-medium">Transport Layer Security (TLS) Version 3 RFC 8446</h3>
                      <p className="text-sm text-gray-600 mb-2">Contributor to the specification</p>
                      <a 
                        href="https://datatracker.ietf.org/doc/html/rfc8446" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors text-sm flex items-center"
                      >
                        Specification
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-medium">CVE-2018-1000520</h3>
                      <p className="text-sm text-gray-600 mb-2">Discovered vulnerability in ARM mbedTLS</p>
                      <a 
                        href="https://nvd.nist.gov/vuln/detail/CVE-2018-1000520" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors text-sm flex items-center"
                      >
                        CVE Details
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-medium">Python Software Foundation (PSF)</h3>
                      <p className="text-sm text-gray-600 mb-2">Contributing Member</p>
                      <a 
                        href="https://www.python.org/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors text-sm flex items-center"
                      >
                        Learn More At Python.org
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  )
}
