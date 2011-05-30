Rabu Schedule Release Checklist
===============================

1. Update CHANGELOG (and README, if necessary)
2. `rake release shutdown`
3. Commit
4. Remove '.dev' from README
5. Update version number in Java code's "usage.txt"
6. Commit with 'Release X.Y.Z' as commit message
7. `git tag "release-X.Y.Z"
8. `git push`
9. `git push --tags`
10. Increment version number in README and add '.dev'
11. Commit with message 'Started X.Y.Z' (use new version number)
12. Announce to mailing list

Mailing list announcement template
---

Subject: Rabu X.Y.Z released

Rabu X.Y.Z has been released. You can download it from https://github.com/teamrabu/rabu-schedule .

Changes:
[Paste in changelog]