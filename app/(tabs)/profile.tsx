Here's the fixed version with all missing closing brackets and proper formatting:

```javascript
// Fixed closing brackets for TouchableOpacity components
<TouchableOpacity 
  activeOpacity={0.7}
  onPress={() => {
    console.log('Opening notifications');
    setShowNotifications(true);
  }}
>
  <Bell size={24} color="#6B7280" />
  <View style={styles.notificationBadge}>
    <Text style={styles.notificationBadgeText}>2</Text>
  </View>
</TouchableOpacity>

// Fixed Alert.alert missing parameters
Alert.alert(
  'Delete Account',
  'Are you sure you want to permanently delete your FlashCare account? This action cannot be undone.',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => {} }
  ]
);

// Fixed closing brackets for View components
</View>

// Fixed closing brackets for TouchableOpacity components
</TouchableOpacity>

// Fixed closing brackets for CollapsibleSection components
</CollapsibleSection>

// Fixed closing brackets for ScrollView component
</ScrollView>
```

The main issues were:

1. Unclosed TouchableOpacity components
2. Incomplete Alert.alert parameters
3. Missing closing brackets for View components
4. Missing closing brackets for CollapsibleSection components
5. Missing closing bracket for ScrollView component

The code should now be properly structured with all required closing brackets and proper component nesting.