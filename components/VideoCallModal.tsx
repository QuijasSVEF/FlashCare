import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal,
  StyleSheet, 
  TouchableOpacity,
  Alert,
  Platform 
} from 'react-native';
import { X, Video, VideoOff, Mic, MicOff, Phone } from 'lucide-react-native';
import { Button } from './ui/Button';
import { Colors } from '../constants/Colors';

interface VideoCallModalProps {
  visible: boolean;
  onClose: () => void;
  otherUserName: string;
  isIncoming?: boolean;
}

export function VideoCallModal({ 
  visible, 
  onClose, 
  otherUserName,
  isIncoming = false 
}: VideoCallModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    setIsConnected(true);
  };

  const handleDecline = () => {
    onClose();
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Call', style: 'destructive', onPress: onClose },
      ]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  if (Platform.OS === 'web') {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container}>
          <View style={styles.webNotice}>
            <Video size={48} color="#6B7280" />
            <Text style={styles.webNoticeTitle}>Video Calls Not Available</Text>
            <Text style={styles.webNoticeText}>
              Video calling is only available on mobile devices. Please use the iOS or Android app for video calls.
            </Text>
            <Button title="Close" onPress={onClose} style={styles.closeButton} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Video Area */}
        <View style={styles.videoContainer}>
          <View style={styles.remoteVideo}>
            <Text style={styles.videoPlaceholder}>
              {isConnected ? `${otherUserName}'s Video` : 'Connecting...'}
            </Text>
          </View>
          
          <View style={styles.localVideo}>
            <Text style={styles.localVideoText}>You</Text>
          </View>
        </View>

        {/* Call Info */}
        <View style={styles.callInfo}>
          <Text style={styles.callerName}>{otherUserName}</Text>
          {isConnected ? (
            <Text style={styles.callStatus}>{formatDuration(callDuration)}</Text>
          ) : (
            <Text style={styles.callStatus}>
              {isIncoming ? 'Incoming call...' : 'Calling...'}
            </Text>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {isConnected && (
            <>
              <TouchableOpacity
                style={[styles.controlButton, isMuted && styles.mutedButton]}
                onPress={toggleMute}
              >
                {isMuted ? (
                  <MicOff size={24} color="#FFFFFF" />
                ) : (
                  <Mic size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, !isVideoEnabled && styles.mutedButton]}
                onPress={toggleVideo}
              >
                {isVideoEnabled ? (
                  <Video size={24} color="#FFFFFF" />
                ) : (
                  <VideoOff size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </>
          )}

          {isIncoming && !isConnected ? (
            <View style={styles.incomingControls}>
              <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                <Phone size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
                <Phone size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Phone size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 40, 
    backgroundColor: Colors.background,
  },
  webNoticeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 16,
  },
  webNoticeText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  closeButton: {
    width: 200,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: Colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 18,
    color: Colors.text.inverse,
    textAlign: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: Colors.gray[700],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoText: {
    fontSize: 14,
    color: Colors.text.inverse,
  },
  callInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.inverse,
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: Colors.gray[300],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    backgroundColor: Colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: Colors.error,
  },
  incomingControls: {
    flexDirection: 'row',
    gap: 60,
  },
  answerButton: {
    width: 70,
    height: 70,
    borderRadius: 35, 
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    width: 70,
    height: 70,
    borderRadius: 35, 
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35, 
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
});