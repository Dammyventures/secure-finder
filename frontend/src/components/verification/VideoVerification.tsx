import React, { useState, useRef, useEffect } from 'react'
import { Video, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, User, Shield } from 'lucide-react'
import Button from '../common/UI/Button'
import Alert from '../common/Feedback/Alert'

interface VideoVerificationProps {
  onComplete: () => void
  onCancel: () => void
  verificationId?: string
}

const VideoVerification: React.FC<VideoVerificationProps> = ({
  onComplete,
  onCancel,
  verificationId,
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [step, setStep] = useState(1) // 1: Instructions, 2: Verification, 3: Complete
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'processing' | 'verified' | 'failed'>('pending')
  const [verificationMessage, setVerificationMessage] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const countdownRef = useRef<number | null>(null)

  // Steps content
  const steps = [
    {
      id: 1,
      title: 'Prepare for Video Verification',
      description: 'Please ensure you have a stable internet connection and are in a well-lit area.',
    },
    {
      id: 2,
      title: 'Live Video Verification',
      description: 'Follow the instructions and complete the verification process.',
    },
    {
      id: 3,
      title: 'Verification Complete',
      description: 'Your identity verification has been completed.',
    },
  ]

  // Initialize camera
  useEffect(() => {
    if (step === 2) {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [step])

  // Countdown timer
  useEffect(() => {
    if (isRecording && countdown > 0) {
      countdownRef.current = window.setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      completeVerification()
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current)
      }
    }
  }, [isRecording, countdown])

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: isAudioOn,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setVerificationMessage('Unable to access camera. Please check permissions.')
      setVerificationStatus('failed')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const startVerification = async () => {
    setStep(2)
    setCountdown(30)
    setIsRecording(true)
    setVerificationStatus('processing')
    setVerificationMessage('Please look directly at the camera...')
  }

  const completeVerification = async () => {
    setIsRecording(false)
    setVerificationStatus('verified')
    setVerificationMessage('Verification successful!')

    // Simulate API call
    setTimeout(() => {
      setStep(3)
      stopCamera()
    }, 2000)
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn
        setIsVideoOn(!isVideoOn)
      }
    }
  }

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn
        setIsAudioOn(!isAudioOn)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Video Identity Verification</h2>
              <p className="text-gray-600">
                This verification helps ensure the security and integrity of our platform.
              </p>
            </div>

            <Alert
              type="info"
              title="Important Guidelines"
              message="Please follow these guidelines for successful verification:"
            />

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Face the Camera</h3>
                  <p className="text-sm text-gray-600">
                    Look directly at the camera. Make sure your entire face is visible.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Show Your ID</h3>
                  <p className="text-sm text-gray-600">
                    Hold your ID document next to your face for comparison.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <VideoIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Good Lighting</h3>
                  <p className="text-sm text-gray-600">
                    Ensure you are in a well-lit area without backlighting.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">What to Expect</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• You'll have 30 seconds to complete the verification</li>
                <li>• Keep your ID document ready</li>
                <li>• Follow on-screen instructions</li>
                <li>• Verification typically takes 1-2 minutes</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={startVerification} variant="primary">
                Start Verification
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Live Video Verification</h2>
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-blue-600">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                <span>Time remaining: {formatTime(countdown)}</span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!isAudioOn}
                className="w-full h-64 md:h-96 object-cover"
              />

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoOn ? 'bg-gray-800 text-white' : 'bg-red-600 text-white'
                  }`}
                  title={isVideoOn ? 'Turn off video' : 'Turn on video'}
                >
                  {isVideoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    isAudioOn ? 'bg-gray-800 text-white' : 'bg-red-600 text-white'
                  }`}
                  title={isAudioOn ? 'Mute audio' : 'Unmute audio'}
                >
                  {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
              </div>

              {/* Verification Status Overlay */}
              {verificationStatus !== 'processing' && (
                <div className="absolute top-4 left-4 right-4">
                  <div className={`p-4 rounded-lg ${
                    verificationStatus === 'verified' 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-red-100 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {verificationStatus === 'verified' ? (
                        <Shield className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <PhoneOff className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className="font-medium">
                        {verificationMessage}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions Overlay */}
              <div className="absolute top-4 right-4">
                <div className="bg-black bg-opacity-75 text-white p-3 rounded-lg">
                  <p className="text-sm font-medium">Instructions:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• Hold ID next to face</li>
                    <li>• Look at camera</li>
                    <li>• Stay still</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${
                  countdown > 20 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">1</div>
                    <p className="text-sm font-medium">Show Face</p>
                    <p className="text-xs text-gray-600">Look directly at camera</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  countdown > 10 && countdown <= 20 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">2</div>
                    <p className="text-sm font-medium">Show ID</p>
                    <p className="text-xs text-gray-600">Hold ID next to face</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  countdown <= 10 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">3</div>
                    <p className="text-sm font-medium">Complete</p>
                    <p className="text-xs text-gray-600">Wait for confirmation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="outline" disabled={isRecording}>
                Back
              </Button>
              {verificationStatus === 'verified' ? (
                <Button onClick={() => setStep(3)} variant="primary">
                  Continue
                </Button>
              ) : (
                <Button onClick={completeVerification} variant="primary" disabled={isRecording}>
                  Complete Verification
                </Button>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verification Complete!</h2>
              <p className="text-gray-600">
                Your identity has been successfully verified through video call.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Verification ID:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {verificationId || 'VID' + Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Method:</span>
                  <span className="font-medium">Video Verification</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Completed:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Alert
              type="success"
              title="Verification Successful"
              message="You can now report and claim items with enhanced verification level."
            />

            <div className="flex justify-center">
              <Button onClick={onComplete} variant="primary" size="lg">
                Continue to Dashboard
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <React.Fragment key={stepItem.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > stepItem.id
                      ? 'bg-green-100 text-green-600'
                      : step === stepItem.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > stepItem.id ? (
                    <Shield size={20} />
                  ) : (
                    <span className="font-medium">{stepItem.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{stepItem.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-grow h-1 bg-gray-200 mx-4">
                  <div
                    className={`h-full ${
                      step > stepItem.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ width: step > stepItem.id ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {renderStepContent()}
      </div>
    </div>
  )
}

export default VideoVerification